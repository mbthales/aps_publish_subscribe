import pika
import random
import time

class RabbitmqPublisher:
    def __init__(self):
        self.__host = 'localhost'
        self.__port = 5672
        self.__username = 'guest'
        self.__password = 'guest'
        self.__exchange = 'teste'
        self.__channel = self.__create_channel()

    def __create_channel(self):
        connection_params = pika.ConnectionParameters(host=self.__host, port=self.__port, credentials=pika.PlainCredentials(self.__username, self.__password))
        connection = pika.BlockingConnection(connection_params)
        channel = connection.channel()
        return channel
    
    def send_msg(self, msg):
        self.__channel.basic_publish(exchange=self.__exchange, body=msg, routing_key='')
        print(f" [x] Sent {msg} to {self.__exchange}")


if __name__ == '__main__':
    publisher = RabbitmqPublisher()

    while True:
        number = random.randint(70, 150)
        publisher.send_msg(str(number))
        time.sleep(1)
