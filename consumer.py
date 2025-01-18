import pika

class RabbitmqConsumer:
    def __init__(self):
        self.__host = 'localhost'
        self.__port = 5672
        self.__username = 'guest'
        self.__password = 'guest'
        self.__queue = 'teste'
        self.__channel = self.__create_channel()

    def __create_channel(self):
        connection_params = pika.ConnectionParameters(host=self.__host, port=self.__port, credentials=pika.PlainCredentials(self.__username, self.__password))
        connection = pika.BlockingConnection(connection_params)
        channel = connection.channel()
        channel.queue_declare(queue=self.__queue, durable=True)
        channel.basic_consume(queue=self.__queue, auto_ack=True, on_message_callback=self.__callback) 

        return channel
    
    def __callback(self, ch, method, properties, body):
        print(f" [x] Received {body}")
    
    def consume(self):
        print(' [*] Waiting for messages. To exit press CTRL+C')
        self.__channel.start_consuming()

if __name__ == '__main__':
    consumer = RabbitmqConsumer()
    consumer.consume()