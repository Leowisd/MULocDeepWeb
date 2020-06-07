# FROM node:8
# RUN apt-get update && apt-get install -y \
#     software-properties-common
# RUN add-apt-repository ppa:deadsnakes/ppa
# RUN apt-get update && apt-get install -y \ 
#     python3.7 \
#     python3-pip \
#     python3-tk

FROM nikolaik/python-nodejs:python3.7-nodejs10	
RUN apt-get update && apt-get install -y \ 
    python3-tk
RUN python -m pip install numpy scipy && python -m pip install biopython && python -m pip install h5py && python -m pip install tensorflow==1.13.1 && python -m pip install keras==2.3.0 && python -m pip install matplotlib
RUN wget ftp://ftp.ncbi.nlm.nih.gov/blast/executables/blast+/2.9.0/ncbi-blast-2.9.0+-x64-linux.tar.gz
RUN tar zxvpf ncbi-blast-2.9.0+-x64-linux.tar.gz
RUN rm ncbi-blast-2.9.0+-x64-linux.tar.gz
ENV PATH "$PATH:/ncbi-blast-2.9.0+/bin"

RUN rm -rf /app
RUN mkdir /app
WORKDIR /app           

COPY . /app
RUN npm install
EXPOSE 8082

CMD BUILD_ENV=docker node app.js
