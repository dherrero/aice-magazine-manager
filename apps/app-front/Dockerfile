FROM nginx

USER root

ENV APP_DIR /usr/share/nginx/html/

COPY ../../../nginx/mime.types /etc/nginx/conf.d/mime.types
COPY ../../../nginx/gzip.conf /etc/nginx/conf.d/gzip.conf
COPY ../../../nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ../../../nginx/nginx.conf /etc/nginx/nginx.conf

RUN groupadd app-front && \
    useradd -g 0 -l -m -s /bin/bash -u 109012 app-front && \
    usermod -a -G app-front app-front && \
    mkdir -p ${APP_DIR} && \
    chown -R app-front:app-front ${APP_DIR} && \
    chmod -R 775 ${APP_DIR} && \
    touch /var/run/nginx.pid && \
    mkdir /var/cache/nginx/client_temp var/cache/nginx/uwsgi_temp var/cache/nginx/scgi_temp && \
    mkdir /var/cache/nginx/proxy_temp var/cache/nginx/fastcgi_temp && \
    chown -R app-front:app-front /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 775 /var/cache/nginx /var/run /var/log/nginx

WORKDIR ${APP_DIR}

EXPOSE 80

USER app-front

ARG BUILD_DIR=../../../dist/apps/app-front/browser
COPY ${BUILD_DIR} ${APP_DIR}
