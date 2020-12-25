until $(curl --output /dev/null --silent --head --fail http://localhost:8080); do
    printf 'backend...'
    sleep 3
done

until $(curl --output /dev/null --silent --head --fail http://localhost:8180); do
    printf 'sso...'
    sleep 3
done

node server.js
