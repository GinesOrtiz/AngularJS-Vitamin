# AngularJS-Vitamin by @GinesOrtiz
Full angularJS base including Auth with different roles and dynamic locale and layouts

# For which kind of project should I use this seed?
This seed is made for projects where you will have multiple users with different roles and secctions depending of the 
user role, different layouts as you need and i18n across all the project.

# Content of the seed
* Auth module with different roles (angular-permission)
* i18n filter (ng-i18next)
* AngularJS dynamic locale (angular-dynamic-locale)
* Dynamic layouts
* Http interceptor to inject Header authentication
* Bootstrap + UI Bootstrap
* SASS styles for each module and view

# Comments on code
Almost every file from features folder has comments to explain how it works and the practices that I recommend to use
based on multiple guidelines I read. It's highly recommended to read all file's comments.

# Pre-requisites
* nodeJS
* Ruby
* Compass & Sass
* Gulp

# Installation
```
sudo npm install
bower install
```

# Deploy the project in development mode
```
gulp start
```
### Actions made with *gulp start*
* Run a server with the folder app as root with live reload in .js .html and .css files
* SASS compiler
* Vendor packages concat and compressed
* App .js files concat but not compressed

# Compile project for production
```
gulp compile
```
### Actions made with *gulp start*
* Same as gulp start
* App .js files concat AND compressed

#### NOTES
File's names are very important in order to concat in the correct way automaticly.
* Modules: module.name.js
* Service: service.name.js
* Controller: controller.name.js
* Templates: name.tpl.html

# Folders to avoid (.gitignore)
* .idea
* .sass-cache
* node_modules
* bower_components
* /temp

# TODOS
- [ ] Add different layouts for each user role
- [ ] Make an online demo to test
- [ ] Use Jasmine to test the services
- [ ] Improve UIX?
- [x] Add a readme with the basic actual functions
- [x] Comment Gulp functions
