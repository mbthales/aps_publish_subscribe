1. Instale o Docker.
2. Rode no terminal `docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management` e não feche.
3. Acesse localhost:5172.
4. Crie uma enchange com o nome "teste".
5. Crie uma queue com o nome "teste" e faça o link com a enchange criada.

6. Instale o Python.
7. Rode no terminal `pip3 install -r requirements.txt` na raiz do projeto.
8. Rode `python3 consumer.py` em um terminal.
9. Rode `python3 publish.py` em outro terminal.