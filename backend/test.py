import time


def main():
    current_time = time.time()
    if current_time > 1743390058:
        print("token has expired")
    else:
        print("token has not expired")
    
    
if __name__ == "__main__":
    main()