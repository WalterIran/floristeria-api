# floristeria-api usage and recommendations

## Clone repository
1. Go to the folder where you want to store the project
2. `git clone https://github.com/WalterIran/floristeria-api.git`
3. `cd /floristeria-api`
4. Type `code .` to open on VS Code or open the folder on your prefered code editor

### VS Code recommended extensions
- Prisma

## Install Node Dependencies
- `npm install`

## Install nodemon globally for hot reloading
- `npm install -g nodemon`

## Create your branch, **DON'T WORK ON _MAIN_ BRANCH**
- `git checkout -b <branchName>`

## Environmental Variables Configuration
1. Create a copy of **_.env.template_** and name it as **_.env_** 
2. Add your values to environmental variables

## Initialize Prisma
1. `npx prisma db pull` to pull database to your `schema.prisma` file.
2. `npx prisma generate` to install Prisma Client. You can then start querying your database.
3. On VS Code press `CTRL + SHIFT + P` on Windows or `CMD + SHIFT + P`for macOs to open VS Code commands
4. Choose option: _Reload Window_ (this will reload VS CODE)

## START WORKING💪😎🖥️
`npm run dev`

![Siuu image](https://ih1.redbubble.net/image.3074498544.0129/st,small,507x507-pad,600x600,f8f8f8.jpg)
