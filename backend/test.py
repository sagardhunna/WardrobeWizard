import time


def main():
    current_time = time.time()
    if current_time > 1743371380:
        print("token has expired")
    else:
        print("token has not expired")
    
    
if __name__ == "__main__":
    main()