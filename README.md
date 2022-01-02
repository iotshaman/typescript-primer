# Typescript Primer

Typescript is a compiled, "strongly-typed" language built on top of javascript (a "superset") that aims to improve developer experience by catching potential coding mistakes before runtime errors occur. While javascript does have the concept of data types (string, number, Date, etc), it is not strongly-typed, meaning you do not define what "type" a variable is when declaring it; instead, types in javascript are "inferred", meaning the interpreter will figure out the type based on the value provided. While this has its benefits, it can quickly cause problems, especially when working on large code bases; even worse, these problems are typically found at runtime. For example, take a look at the following code:

```js
const var1 = "test";
const var2 = 0;
console.log(var1 + var2) // Output: "test0";
```

Since var1 and var2 don't have declared types, you can add these two together, which would result in var2 being converted to a string, before being concatenated to var1. While you may have meant to do this, it is more likely that this was a oversight, and javascript does not do anything to prevent it, or even warn you of the potential mistake. In Typescript, this would result in an error during compilation, and even better, your IDE (integrated developer environment, for example: Visual Studio, Eclipse, Atom, etc.) should catch this and display an error as you write it.

Now, obviously no one would write the above code, but as software projects grow, lots of exported functions will accept inputs, and in a pure javascript environment, it is easy to pass a value of the wrong data type to a function, causing a runtime error.

## What does "strongly-typed" mean?

Languages that are strongly-typed allow developers to apply "types" to variables. The purpose of this is to prevent developers from running operations on 2 or more data types that are incompatible. For example, take a look at the below javascript code sample (no types)

```js
function getHoursDisplay(date) {
  return `Hours: ${date.getHours()}`;
}

// invoke getHoursDisplay with invalid type
const hoursDisplay: string = getHoursDisplay("1/1/2022");
```

Since javascript doesn't know that "getHoursDisplay" expects a datetime, you can pass a date string (not a Date object) to the function, which will result in a runtime error (since the object provided does not have a method "getHours()").

Now take a took at the following typescript example:

```ts
function getHoursDisplay(date: Date): string {
  return `Hours: ${date.getHours()}`;
}

// invoke getHoursDisplay with invalid type
// in an IDE, this would display an error and prevent compilation (thats a good thing!)
const hoursDisplay: string = getHoursDisplay("1/1/2022"); 
```

Notice that the "date" parameter on the method "getHoursDisplay" is declared as a "Date" object. Now, instead of catching this at runtime (when an error actually occurs, potentially irritating your end-users), your IDE will show an error, and you will not be able to complile until you fix the error (see below).

```ts
function getHoursDisplay(date: Date): string {
  return `Hours: ${date.getHours()}`;
}

// invoke getHoursDisplay with invalid type
// notice we now provide a valid "Date" type, fixing the above issue
const hoursDisplay: string = getHoursDisplay(new Date()); 
```

In Typescript, you can apply a type to any variable when declaring the variable. If you do not apply a type to a declared variable, it will use a default type of "any"; while this can be useful in edge-cases, it should be avoided at all costs, since the "any" variable does not provide any "type-checking", meaning you are not leveraging the benefits of typescript. When in "strict mode" (see below) you are required to declare types for every variable; this doesn't mean you can't use any, it just means you have to declare that the variable is of type "any". 

## Compilation

Typescript is a compiled language, meaning the raw source code cannot be executed; instead, it needs to be "compiled" into something that can be executed. When typescript is compiled, it is converted into javascript (or more modern things like ECMAscript, which is just javascript by another name with additional features). To compile typescript into javascript, you simply need to run the following command in a folder with a "tsconfig.json" file (see below, [Configuring a Typescript Project](#configuring-a-typescript-project)):

```sh
tsc
```

*Note: there are some modern tools that allow you to execute typescript files, but these are new and experimental (at the time of writing this article), so we will focus on the traditional approach of compiling to javascript.*

## Installing Typescript

Typescript is installed using npm (node package manager), so before you can install typescript, you will need to install NodeJS (which will include npm). Once you have NodeJS + npm on your machine, open a command line interface (CMD, bash, etc.) and run the following command:

```sh
npm i -g typescript
```

*Note: You can also install typescript inside a node package, however for this purposes of this article, we will assume you have installed globally.* 

## Configuring a Typescript Project

To create a typescript project, you first want to create a node package (its not technically required, but you will need it later). To create a node package, first create a folder in which to store code, then navigate to it in a command line interface and enter the following command:

```sh
npm init
```

This will prompt you to answer a few questions, simply press enter for each prompt if you want to keep the default. Once complete, a new file "package.json" will be added. Now to setup typescript, all you need to to is run the following command (in the same command line interface as before):

```sh
tsc --init
```

This will create a new file "tsconfig.json", and set some default values. Now lets take a closer look at some of these values, and how you can use them to control how your project is compiled.

### Configuration Reference

Since projects can vary in scope, size, intent, etc., you may require a different typescript configuration for different projects. The below properties can be modified to do things like: include libraries, include / exlude files, change the target environment, configure where to ouput the compiled javascript files, and more.

*Note:* This configuration reference is meant to be used as a quick-start guide to understanding the most important compiler options, and is therefore not a complete reference. For a full reference to all tsconfig.json values, please view the [official documentation](https://www.typescriptlang.org/tsconfig).

Below is a sample tsconfig.json file, we will use this to explore the different properties.

```json
{
  "compilerOptions": {
    "target": "es6",
    "lib": ["es2020"],
    "module": "commonjs",
    "strict": false,
    "outDir": "dist",
    "declaration": true,
    "sourceMap": true,
    "experimentalDecorators": true,
    "typeRoots": [
      "node_modules/@types"
    ]
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "src/**/*spec.ts"
  ]
}
```

**compilerOptions.target**

Did you know that there are several different versions of javascript, each with varying support from different browsers / interpreters? The "compilerOptions.target" property can be modified to generate compiled javascript for different javascript versions. The trick to using this property it to understand where your code will be deployed and executed. If you are going for mass appeal, you will want to use an older version so your compiled code is compatible with the majority of browsers / interpreters. If you know that your code will be running on something that supports newer versions of javascript then you may want to use a more recent version, which would come with some performance improvements. 

For a full list of available "target" options, please [click here](https://www.typescriptlang.org/tsconfig/#target).

**compilerOptions.lib**

This property is used to configure what javascript features are available at compilation time. If your development platform has a new-ish version of NodeJS, then you can use one of the more modern versions of javascript; if your development platform is using an older version of NodeJS, you may need to use an older version of javascript to prevent compiler errors.

For a full list of available "lib" options, please [click here](https://www.typescriptlang.org/tsconfig#lib).

**compilerOptions.module**

This property is used to configure what program is used for "module resoulution". Module resolution is how the typescript compiler knows where to look when you reference installed dependencies. When using NodeJS, you will almost for sure want to use "commonjs", but if you are compiling typescript in an environment other than NodeJS, you may need to change this value (other common options are "system" and "umd", but you do not need these if you are using NodeJS + typescript).

For a full list of available "module" options, please [click here](https://www.typescriptlang.org/tsconfig#module).

**compilerOptions.strict**

The strict option forces developers to follow best practices, like declaring types for all variables. This can make development slightly more difficult, since there are more rules to follow, but it helps the compiler generate better code, and can even reduce the size of compiled code (sometimes drastically).

For a full list of available "strict" options, please [click here](https://www.typescriptlang.org/tsconfig#strict).

**compilerOptions.outDir**

Where to write compiled javascript files. By convention, we typically use "dist", but this can be anything you want.

For more information about the "outDir" option, please [click here](https://www.typescriptlang.org/tsconfig#outDir).

**compilerOptions.declaration**

When set to true, this instructs the compiler to generate "declaration" files. These are useful if you are going to publish your code for other people to use in the projects. When other projects use your compiled javascript, these declaration files tell IDE's what types are available.

For more information about the "declaration" option, please [click here](https://www.typescriptlang.org/tsconfig#declaration).

**compilerOptions.sourceMap**

When set to true, this instructs the compiler to generate "source map" files. These are useful when debugging your compiled javascript.

For more information about the "sourceMap" option, please [click here](https://www.typescriptlang.org/tsconfig#sourceMap).

**compilerOptions.experimentalDecorators**

When set to true, developers can leverage a feature of javascript called "decorators". Decorators are little bits of code you can add *on top of* other code, to modify behavior.

For more information about the "experimentalDecorators" option, please [click here](https://www.typescriptlang.org/tsconfig#experimentalDecorators).

**compilerOptions.typeRoots**

Takes an array of strings that instruct the compiler where to find type definitions for installed dependencies. Modernly, many npm packages come with their own type definitions, but when typescript first came around none of the existing npm packages had available type definitions. So to bridge this gap, most well-managed npm packages created type definitions for their existing packages, and published them to an npm repository called "Definitely Typed". The "typeRoots" compiler option allows you to specify the names of installed node packages that you want to be available to your development environment. You first must install the npm package, then install the type definition package. For example, to install the common http-server package "Express JS", and its type definition, enter the following commands:

```sh
npm i express --save
npm i @types/express --save-dev
```

Then, in the tsconfig.json "compilerOptions.typeRoots" array, add the string "node_modules/@types". Now you can use the type definitions for express when writing your source code. For example:

```ts
//server.ts
import { Request, Response, Application, Router } from "express";
```

For more information about the "typeRoots" option, please [click here](https://www.typescriptlang.org/tsconfig#typeRoots).

**include**

Specifies a list of glob patterns that match files to be included in compilation. If no 'files' or 'include' property is present in a tsconfig.json, the compiler defaults to including all files in the containing directory and subdirectories except those specified by 'exclude'. Requires TypeScript version 2.0 or later.

*Source: Visual Studio Code*

**exclude**

Specifies a list of files to be excluded from compilation. The 'exclude' property only affects the files included via the 'include' property and not the 'files' property. Glob patterns require TypeScript version 2.0 or later.

*Source: Visual Studio Code*