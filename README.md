# MULocDeepWeb

## Path

In MULocDeep/predict.py

Using absolute path in two cases

line 278:
```python
psiblast_cline = NcbipsiblastCommandline(query=inputfile, db='/home/leowisd/Desktop/workplace/MULocDeepWeb/MULocDeep/db/swissprot/swissprot',num_iterations=3, evalue=0.001, out_ascii_pssm=pssmfile, num_threads=4)
```

line 395: 
```python
model_small.load_weights('/home/leowisd/Desktop/workplace/MULocDeepWeb/MULocDeep/cpu_models/fold' + str(foldnum) + '_big_lv1_acc-weights.hdf5')
```