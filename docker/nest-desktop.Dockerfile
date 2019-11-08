FROM nestsim/nest:2.18.0
LABEL maintainer="Sebastian Spreizer <spreizer@web.de>"

RUN apt-get update && apt-get install -y python3-pip

# add user 'nest'
RUN adduser --disabled-login --gecos 'NEST' --home /home/nest nest && \
    chown nest:nest /home/nest

# copy entrypoint to nest home folder
COPY ./docker/entrypoint.sh /home/nest
RUN chown nest:nest /home/nest/entrypoint.sh && \
    chmod +x /home/nest/entrypoint.sh && \
    echo '. /opt/nest/bin/nest_vars.sh' >> /home/nest/.bashrc

COPY package.json /tmp/

# install nest-desktop and nest-server
RUN pip3 install nest-desktop==2.2.* --upgrade

EXPOSE 5000 8000
WORKDIR /home/nest
USER nest
ENTRYPOINT ["/home/nest/entrypoint.sh"]
