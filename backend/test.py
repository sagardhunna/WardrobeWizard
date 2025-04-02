

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'heic', 'jpeg', 'jpg'}
    
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def main():
    filename = "IMG_0485.HEIC"
    is_allowed = allowed_file(filename)
    
    print(f'It is {is_allowed} that {filename} is allowed')
    
if __name__ == "__main__":
    main()
    