# MULocDeepWeb

Version 1.1

## System

Ubuntu 16.04

## Framework

NodeJS Express

## Path Configuration

Change two paths to relative path to the current calling script.

utils.py, line 275:
```python
psiblast_cline = NcbipsiblastCommandline(query=inputfile, db='./MULocDeep/db/swissprot/swissprot',num_iterations=3, evalue=0.001, out_ascii_pssm=pssmfile, num_threads=4)
```

predict.py, line 147
```python
model_small.load_weights('./MULocDeep/cpu_models/fold' + str(foldnum) + '_big_lv1_acc-weights.hdf5')
```

## Docker
```
docker-compose up -d
```
Visit heep://localhost:8082/

## To do List

1. ~~Modify the display page~~
2. ~~change the display of result JSON data~~
3. ~~modify the example page~~
4. ~~add features to tables in example pages~~ 
5. ~~new email~~
6. ~~add some locations on the map~~
7. ~~fix the the number of total query bug~~
8. ~~Add CONTACT page~~
9. ~~Add some introduction~~
10.  search ID ? IP
### version 1.1
11. ~~add email input on job waiting page, update database~~
12. ~~add estimated time on job waiting page, add time function~~
13. ~~change the index to upload page~~
14. ~~change the results of predicting to bar chart~~
15. ~~add check function on vliad FASTA file~~
16. ~~delete pssm file after predicting~~
17. ~~change two alerts of uploading to font-end/add two error pages.~~
18. ~~Set Docker.~~
19. ~~recover the auto delete model * fix delete folder bug.~~ change shcedule to each day
20. ~~change the MAP page UI~~
### Version 1.3
21. ~~update predict script to avoid invalid seq name.~~
### Version 1.4
22. update time estimating function
23. add fix space error functuion
24. check can we add more paramaters to database schema

## Problem
1. ~~predict.py, predicting query like >Medtr2g018290.1;AT4G32520.2 wrong.~~(temp solution: replace ; with :)
2. ~~two types results catelogs different?~~