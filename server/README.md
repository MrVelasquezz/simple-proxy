# Simple-Proxy Server

## Логика приложения

Что бы подключиться к серверу, нужно отправить запрос на авторизацию, что бы сервер отправил порт сокета, а так же проверил существование клиента

Запрос должен быть отправлен на адрес **[HOST:PORT]/auth**
```
method: POST,
headers: {Authorization: API_KEY}
```

Ответ от сервера придет в виде объекта, содержащего в себе порт
```
{
  port: socket.port<int>
}
```

После отправки данного ответа, есть 30 секунд, на установку соединения по сокету. В противном случае сервер отклонит подключение.

После, каждый последующий запрос к серверу будет лишь перезаписывать данные. 

## Логика сокета

- **connection** - устанавливает подключение и проверяет, авторизовался ли клиент
- **disconnection** - удаляет запись о комнате из клиента и устанавливает статус "отключен"
- **new_service** - добавляет новый сервис к клиенту

## ENV переменные

```
RATE_LIMIT=5000 -> лимит на auth middleware
MAX_CONN_TIMEOUT=30000 -> максимальный таймаут на подключение к серверу с момента запроса
```