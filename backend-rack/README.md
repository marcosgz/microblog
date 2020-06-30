# Backend

Backend da aplicação.

## Dependências

* Ruby

## Setup

```
$ ./bin/setup.sh
$ ./bin/server.sh
```

## Resources


Listar posts
```
$ curl -s -X GET -H 'Content-Type: application/json' 'http://localhost:3000/posts'
=> [
  {
    "id": "7cddc125-0bb7-44a1-b5a8-f89556ea30c5",
    "body": "test 1"
  },
  {
    "id": "a40dd28c-c4fa-4adf-982c-da2eddd6a9e4",
    "body": "test 2"
  }
]
```

Atualizar Post `7cddc125-0bb7-44a1-b5a8-f89556ea30c5`
```
$ curl -s -X PUT -H 'Content-Type: application/json' 'http://localhost:3000/posts/7cddc125-0bb7-44a1-b5a8-f89556ea30c5' -d '{
  "body": "Novo conteudo do post"
}'

=> {
  "body": "Novo conteudo do post",
  "id": "7cddc125-0bb7-44a1-b5a8-f89556ea30c5"
}
```

Receber Post
```
$ curl -s -X GET -H 'Content-Type: application/json' http://localhost:3000/posts/7cddc125-0bb7-44a1-b5a8-f89556ea30c5
=> {
  "id": "7cddc125-0bb7-44a1-b5a8-f89556ea30c5",
  "body": "Novo conteudo do post"
}
```

Criar Post
```
curl -s -X POST -H 'Content-Type: application/json' 'http://localhost:3000/posts' -d '{
  "id": "47f56cf2-8e04-4966-9d95-616569afecdd",
  "body": "Novo post"
}'

=> {
  "id": "47f56cf2-8e04-4966-9d95-616569afecdd",
  "body": "Novo post"
}

```

Remover Post `47f56cf2-8e04-4966-9d95-616569afecdd`
```
$ curl -s -X POST -H 'Content-Type: application/json' 'http://localhost:3000/posts/47f56cf2-8e04-4966-9d95-616569afecdd'

=> {}
```
