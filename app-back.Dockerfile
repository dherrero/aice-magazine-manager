FROM docker.io/node:lts-alpine

ENV APP_DIR /home/app-back/

# Crear el grupo y usuario de la aplicación
RUN getent group app-back || addgroup --system app-back && \
    id -u app-back &>/dev/null || adduser --system -G app-back app-back

# Instalar dependencias necesarias
RUN apk update && apk add --no-cache \
    graphicsmagick \
    ghostscript

# Copiar los archivos compilados desde dist
ARG BUILD_DIR=./dist/apps/app-back

COPY ${BUILD_DIR} ${APP_DIR}

WORKDIR ${APP_DIR}

# Instalar solo dependencias de producción
RUN npm install --omit=dev

# Crear directorio de uploads si es necesario
RUN mkdir -p ${APP_DIR}uploads

# Cambiar la propiedad de los archivos
RUN chown -R app-back:app-back .

# Cambiar a un usuario no root
USER app-back

# Exponer el puerto (ajusta si es diferente)
EXPOSE 3200

# Ejecutar la aplicación apuntando correctamente a main.js
CMD [ "node", "main.js" ]
#CMD [ "sleep", "36000" ]
