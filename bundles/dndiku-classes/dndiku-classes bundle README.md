## How to Install

#### 1. clone bundle repo
`git clone address@github.com`

#### 2. enable bundle in ranvier config
Add this line in the "bundles" list ranvier.json:
```
    "dndiku-classes",
```

#### 3. edit src/BundleManager.js
Replace the default BundleManager.loadClasses() method definition with this one:
```
  loadClasses(bundle, classesDir) {
    Logger.verbose(`\tLOAD: Classes...`);
    const files = fs.readdirSync(classesDir);

    this.state.ClassManager.set('Fighter', new Fighter())
    this.state.ClassManager.set('Wizard', new Wizard())

    Logger.verbose(`\tENDLOAD: Classes...`);
  }
```