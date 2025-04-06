from flask import jsonify, Blueprint, request
import uuid
import os
from dotenv import load_dotenv
import boto3
import pillow_heif
import io
from werkzeug.datastructures import FileStorage
import uuid
from PIL import Image

load_dotenv()


def create_aws_blueprint():
    
    aws_bp = Blueprint('aws', __name__)
    
    ALLOWED_EXTENSIONS = {'png', 'jpeg', 'jpg'}

    AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
    AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
    AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")

    s3 = boto3.client(
        "s3",
        aws_access_key_id=AWS_ACCESS_KEY,
        aws_secret_access_key=AWS_SECRET_KEY
    )

    
    # helper function to make sure file is correct filetype
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    
    
    def heic_to_jpeg(uploaded_file):
        heif_image = pillow_heif.read_heif(uploaded_file.stream.read())
        
        image = Image.frombytes(heif_image.mode, heif_image.size, heif_image.data)
        jpeg_io = io.BytesIO()
        image.save(jpeg_io, format="JPEG")
        jpeg_io.seek(0)
        jpeg_file_name = uuid.uuid4().hex + '.jpeg'
        jpeg_file = FileStorage(
            stream=jpeg_io,
            filename=jpeg_file_name,
            content_type="image/jpeg"
        )
        
        return jpeg_file

    # upload image to aws
    @aws_bp.route('/uploadFile', methods=["POST"])
    def uploadFile(acl="public-read"):
        if 'file-to-save' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        
        uploaded_file = request.files["file-to-save"]
        print(f'uploaded_file:', uploaded_file)
        
        file_type = uploaded_file.filename.rsplit('.', 1)[1].lower()
        
        if file_type == 'heic':
            uploaded_file = heic_to_jpeg(uploaded_file)
        
        secure_filename = uuid.uuid4().hex + '.' + uploaded_file.filename.rsplit('.', 1)[1].lower() # generates a unique number for us
        
        try:
            s3.upload_fileobj(
                uploaded_file,
                AWS_BUCKET_NAME,
                secure_filename,
                ExtraArgs={
                    "ACL": acl,
                    "ContentType": uploaded_file.content_type 
                }
            )
            
            s3_url = f"http://{AWS_BUCKET_NAME}.s3.amazonaws.com/{secure_filename}"
            
            return jsonify({
                "message": "Upload successful",
                "filename": secure_filename,
                "url": s3_url
            }), 200
        
        except Exception as e:
            return jsonify({
                "Error": str(e)
            }), 500
            
    return aws_bp
