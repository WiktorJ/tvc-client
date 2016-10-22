# 0.0.1
### First version of component

# 0.0.2
### Refactoring
* Applying changes according to suggestion from review CCDB-149

# 0.0.3
### Bugfix
* Fixing urls and hrefs for markers and textpaths in Renderers.

# 0.1.0
### Breaking changes. Configuration objects are affected.
* Changed es6 Map to CustomMap (es6 version is not currently supported in every browser)

# 0.1.1
### Features
* Now node details are rendered as html.

# 0.2.0
### Features
* Now shape of node can be changed from configuration level

# 0.2.1
### Bugfix
* Fixing problem with wrong Map type.

# 0.2.2
### Features
* 'X' button has been added to details window.

# 0.2.3
### Features and Refactoring
* Canvas width is now dynamically set to max
* Removed Draw and Legend button
* Removed dataManager dropdown list (For Synoptics)
* Overall improvement in CSS

# 0.2.4
### Styling
* CSS improved

# 0.2.5
### Refactoring
* Changes data fields mapping in default configuration

# 0.2.6
### Features
* Added search functionality
* Added optional drop-down list triggered visualisation

# 0.2.7
### Bugfix
* Search minor bugs fixed

# 0.3.0
### Breaking Changes.
*  mainNodeId (in ITopologyQueryConfig) is now function taking dynamic custom parameters as argument
    (instead of being string value)