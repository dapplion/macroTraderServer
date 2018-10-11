# Macrotrader Server

Use in conjuction with macrotrader UI. Only supports bittrex

## Installation

1. Install Brew (helps you install node)

``
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
``

2. Install node with Brew

``
brew install node
``

Check that the installation is okay. Run this two commands

``
node -v
``
should return something like v0.10.31 and 1.4.27

``
npm -v
``
should return something like 1.4.27

3. Download this repository, open a terminal, navigate into it and run

``
npm install
``

4. Once the installation is completed execute the server with

``
npm start
``

and navigate to http://localhost:3000/

