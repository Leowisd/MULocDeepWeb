FROM node:8
RUN apt-get update && apt-get install -y \ 
    python2.7 \
    python-pip \
    python-tk
RUN python -m pip install numpy scipy && python -m pip install biopython && python -m pip install h5py && python -m pip install tensorflow==1.11.0 && python -m pip install keras==2.1.5 && python -m pip install matplotlib
RUN wget ftp://ftp.ncbi.nlm.nih.gov/blast/executables/blast+/2.7.1/ncbi-blast-2.7.1+-x64-linux.tar.gz
RUN tar zxvpf ncbi-blast-2.7.1+-x64-linux.tar.gz
RUN rm ncbi-blast-2.7.1+-x64-linux.tar.gz
ENV PATH "$PATH:/ncbi-blast-2.7.1+/bin"

RUN rm -rf /app
RUN mkdir /app
WORKDIR /app           

COPY . /app
RUN npm install
EXPOSE 8082

CMD BUILD_ENV=docker node app.js