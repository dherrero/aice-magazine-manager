FROM docker.io/node:lts-alpine

ENV APP_DIR /home/app-back/

RUN getent group app-back || addgroup --system app-back && \
    id -u app-back &>/dev/null || adduser --system -G app-back app-back

RUN apk  update && apk add graphicsmagick -i

WORKDIR ${APP_DIR}

ARG BUILD_DIR=./dist/apps/app-back

COPY ${BUILD_DIR} ${APP_DIR}

RUN npm -f install --omit=dev

RUN mkdir -p ${APP_DIR}uploads

RUN chown -R app-back:app-back .

USER app-back

EXPOSE 3200

CMD [ "node", "main.js" ]
