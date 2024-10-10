FROM nginx

USER root

# Configura variables de entorno
ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 20.12.2
ENV APP_DIR /usr/share/nginx/html/

# Copia las configuraciones de Nginx
COPY ./nginx/mime.types /etc/nginx/conf.d/mime.types
COPY ./nginx/gzip.conf /etc/nginx/conf.d/gzip.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Establece el directorio de trabajo para la app
WORKDIR /app

# Copia los archivos de package.json y configuración
COPY . /app

# Instala dependencias y Node.js usando NVM
RUN apt-get update && apt-get install -y curl gnupg2 && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash && \
    . "$NVM_DIR/nvm.sh" && \
    nvm install $NODE_VERSION && \
    nvm use $NODE_VERSION && \
    nvm alias default $NODE_VERSION && \
    npm install -g nx@19.2.0 && \
    npm install --verbose && \
    nx reset && \
    npm run build:front -- --verbose && \
    # Copiar archivos generados al directorio Nginx
    cp -r ./dist/apps/app-front/* ${APP_DIR} && \
    # Limpiar archivos y dependencias innecesarias
    npm cache clean --force && \
    cd .. && \
    rm -rf ./app && \
    rm -rf /root/.nvm && \
    apt-get purge -y curl gnupg2 && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Crear usuario que no sea root
RUN groupadd app-front && \
    useradd -g 0 -l -m -s /bin/bash -u 1001 app-front && \
    usermod -a -G app-front app-front && \
    mkdir -p /usr/share/nginx/html/ && \
    chown -R app-front:app-front /usr/share/nginx/html/ && \
    chmod -R 775 /usr/share/nginx/html/ && \
    touch /var/run/nginx.pid && \
    mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/uwsgi_temp /var/cache/nginx/scgi_temp && \
    mkdir -p /var/cache/nginx/proxy_temp /var/cache/nginx/fastcgi_temp && \
    chown -R app-front:app-front /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 775 /var/cache/nginx /var/run /var/log/nginx

# Cambiar el directorio de trabajo al directorio de la aplicación en Nginx
WORKDIR ${APP_DIR}

EXPOSE 80

# Cambiar el usuario a no root
USER app-front

CMD ["nginx", "-g", "daemon off;"]
