<h1>MULocDeepWeb</h1>

- [Web Configuration](#web-configuration)
  - [Running Environment](#running-environment)
  - [Tech Stack](#tech-stack)
  - [Scripts Path Configuration](#scripts-path-configuration)
- [Local Running](#local-running)
  - [Install Python3.7](#install-python37)
  - [Install python dependent packages](#install-python-dependent-packages)
  - [Install blast](#install-blast)
  - [Install Node & npm](#install-node--npm)
  - [Install MongodDB(version: 4.2.1)](#install-mongoddbversion-421)
  - [Download this project](#download-this-project)
  - [Install Node packages via npm](#install-node-packages-via-npm)
  - [Running](#running)
- [Deploy via Docker](#deploy-via-docker)
  - [Install docker & docker-compose](#install-docker--docker-compose)
  - [Edit dockerfile](#edit-dockerfile)
  - [Edit docker-compose.yml](#edit-docker-composeyml)
  - [Building and Deploying](#building-and-deploying)
- [Project Structure](#project-structure)
- [Updates History](#updates-history)
  - [version 1.1](#version-11)
  - [version 1.2](#version-12)
  - [Version 1.3](#version-13)
  - [Version 1.3.1](#version-131)
  - [Version 1.4](#version-14)
  - [Version 1.4.2](#version-142)
  - [Version 1.5](#version-15)

## Web Configuration 

### Running Environment
* OS: Ubuntu 16.04

### Tech Stack
* Front-end: Bootstrap
* Back-end: Node.js
* DB: MongoDB

### Scripts Path Configuration
*/MULocDeepWeb/MULocDeep* is the algorithm module from https://github.com/yuexujiang/MULocDeep

Change two paths to relative path as

/MULocDeepWeb/MULocDeep/utils.py, line 275 & 295:
```python
psiblast_cline = NcbipsiblastCommandline(query=inputfile, db='./MULocDeep/db/swissprot/swissprot',num_iterations=3, evalue=0.001, out_ascii_pssm=pssmfile, num_threads=4)
```

/MULocDeepWeb/MULocDeep/predict.py, line 147:
```python
model_small.load_weights('./MULocDeep/cpu_models/fold' + str(foldnum) + '_big_lv1_acc-weights.hdf5')
```

## Local Running

### Install Python3.7
```
$ apt-get update 
$ apt-get install -y
$ apt-get install python3.7
$ apt-get install python3-pip
```
### Install python dependent packages
```
$ apt-get update && apt-get install -y 
$ apt-get install python3-tk
$ python -m pip install numpy scipy 
$ python -m pip install biopython 
$ python -m pip install h5py 
$ python -m pip install tensorflow==1.13.1 
$ python -m pip install keras==2.3.0 
$ python -m pip install matplotlib
```
### Install blast
```
$ wget ftp://ftp.ncbi.nlm.nih.gov/blast/executables/blast+/2.9.0/ncbi-blast-2.9.0+-x64-linux.tar.gz
$ tar zxvpf ncbi-blast-2.9.0+-x64-linux.tar.gz
$ rm ncbi-blast-2.9.0+-x64-linux.tar.gz
$ PATH "$PATH:/ncbi-blast-2.9.0+/bin"
```
### Install Node & npm
```
$ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```
### Install MongodDB(version: 4.2.1)

### Download this project
```
$ git clone ...
```

**Copy database folder** */db* **directly under** *MULocDeepWeb/MULocDeep/*

### Install Node packages via npm
/MULocDeepWeb
```
$ npm install
```

### Running
/MULocDeepWeb
```
$ sudo service mongod start
$ node app.js
```

## Deploy via Docker

### Install docker & docker-compose

### Edit dockerfile
Check file ***Dockerfile***

### Edit docker-compose.yml
Check file ***docker-compose.yml***

### Building and Deploying
```
$ docker-compose up -d
```
Visit http://localhost:8082/ to check


## Project Structure

- assets: including custimize css file, js file and js lib.
- data: store predicting files & result files
- models: including email config model and db schemes models
- MULocDeep: core algorithm
- routes: including different route file
- views: including *ejs* templates
```
.
+-- assets
|   +-- css
|   +-- js
|   +-- lib
+-- data
|   +-- results
|   +-- upload
+-- models
|   +-- emailConfig.js
|   +-- jobInfo.js
|   +-- userInfo.js
+-- MULocDeep
+-- node_modules
+-- routes
|   +-- index.js
|   +-- jobs.js
|   +-- process.js
|   +-- results.js
|   +-- uploads.js
+-- views
|   +-- partials
|       +-- footer.js
|       +-- header.ejs
|   +-- 404.ejs
|   +-- CONTACT.ejs
|   +-- EXAMPLE.ejs
|   +-- JOBINFO.ejs
|   +-- JOBSLIST.ejs
|   +-- MAP.ejs
|   +-- OUTSPACE.ejs
|   +-- SEARCH.ejs
|   +-- SHOW.ejs
|   +-- TOOLS.ejs
|   +-- UPLOAD.ejs
+-- app.js
+-- package-lock.json
+-- package.json
+-- docker-compose.yml
+-- Dockerfile
```

## Updates History

### version 1.1
1. Modified the display page
2. Changed the display of result JSON data
3. Modified the example page
4. Added features to tables in example pages
5. Modified email config
6. Added some example locations on the map to test
7. Fixed bug: number of total query
8. Added CONTACT page
9. Added some introduction
10. Changed Searching ID Feature to not based on IP
### version 1.2
1.  Added email input feature on job waiting page, update database scheme
2.  Added estimated time on job waiting page, added time estimating function
3.  Changed the index to upload page
4.  Changed the results of predicting to bar chart
5.  Added check function on vliad FASTA file
6.  Changed two alerts of uploading to font-end/add two error pages.
7.  Set Docker.
8.  Recovered the auto delete model 
9.  Fixed bug: delete folder
10. Changed the MAP page UI
### Version 1.3
1. Updated predict script to avoid invalid seq name.
### Version 1.3.1
1. Updated space function, deleted temp files.
### Version 1.4
1. Updated time estimating function to real
2. Added server restart clean function
3. Added number of proteins display
4. Added space adjust function
### Version 1.4.2
1. Fixed util.py path config bug
2. Updated correct timing function
3. Deleted pssm folder
4. Changed schedule cleaning to per day
### Version 1.5
1. Updated schedule cleaning time to UTC 6:00:00