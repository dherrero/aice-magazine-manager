FROM docker.io/node:lts-alpine

ENV APP_DIR /home/app-back/

# Crear el grupo y usuario app-back
RUN getent group app-back || addgroup --system app-back && \
    id -u app-back &>/dev/null || adduser --system -G app-back app-back

# Instalar dependencias necesarias para el build
RUN apk update && apk add --no-cache \
    graphicsmagick \
    ghostscript \
    python3 \
    make \
    g++

# Establece el directorio de trabajo
WORKDIR ${APP_DIR}

# Copiar todo el repositorio
COPY . .

# Instalar dependencias
RUN npm install --verbose

# Compilar la aplicación de back
RUN npm run build:back --verbose

# Mover archivos generados al directorio adecuado y limpiar dependencias y archivos innecesarios
RUN cp -r ./dist/apps/app-back/* ${APP_DIR} && \
    npm prune --production && \
    rm -rf /home/app-back/apps /home/app-back/libs /home/app-back/node_modules /home/app-back/dist && \
    rm -rf /root/.npm /tmp/* /var/cache/apk/*

# Crear directorio de uploads y cambiar permisos
RUN mkdir -p ${APP_DIR}uploads && \
    chown -R app-back:app-back ${APP_DIR}

# Cambiar a usuario no root
USER app-back

# Exponer el puerto 3200
EXPOSE 3200

# Comando para iniciar la aplicación
CMD [ "node", "main.js" ]
