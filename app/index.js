'use strict';

const _ = require('lodash');
const chalk = require('chalk');

const LANGUAGES = ['Java', 'JavaScript', 'Both Java & JavaScript'];
const METHODS = ['get', 'post', 'put', 'delete'];
const TEMPLATE_FORMATS = ['html', 'json', 'xml', 'csv', 'atom', 'rss'];
const FORMAT_SELECTORS = ['any', 'argument', 'extension'];
const AUTHENTICATIONS = ['none', 'guest', 'user', 'admin'];


var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);
        this.log(args);
    }

    writing() {

    }

    prompting() {
        return this.prompt([
            {
                type: 'input',
                name: 'id',
                option: { name: 'id', config: { alias: 'i', desc: 'Webscript id', type: String } },
                message: 'What ' + chalk.yellow('webscript id') + ' should we use?'
            },

            {
                type: 'list',
                name: 'language',
                option: { name: 'language', config: { alias: 'l', desc: 'Language for webscript: java, javascript or both', type: String } },
                choices: LANGUAGES,
                message: 'Which language would you like to develop your script in?'
            },
            {
                type: 'checkbox',
                name: 'methods',
                option: { name: 'methods', config: { alias: 'M', desc: 'A comma separated list of: get, put, post and/or delete', type: String } },
                choices: METHODS,
                default: ['get'],
                message: 'Which HTTP methods would you like to support?'
            },
            {
                type: 'checkbox',
                name: 'templateFormats',
                option: { name: 'template-formats', config: { alias: 't', desc: 'A comma separated list of: html, json, xml, csv, atom and/or rss', type: String } },
                choices: TEMPLATE_FORMATS,
                default: ['html'],
                message: 'Which response formats would you like to support?'
            }, {
                type: 'input',
                name: 'shortname',
                option: { name: 'shortname', config: { alias: 's', desc: 'Shortname for webscript', type: String } },
                message: 'What ' + chalk.yellow('<shortname>') + ' should we use?'
            },
            {
                type: 'input',
                name: 'description',
                option: { name: 'description', config: { alias: 'd', desc: 'Description for webscript', type: String } },
                message: 'What ' + chalk.yellow('<description>') + ' should we use?'
            },
            {
                type: 'input',
                name: 'urlTemplates',
                option: { name: 'url-templates', config: { alias: 'u', desc: 'Vertical bar \'|\' separated list of url templates', type: String } },
                message: 'Provide an ' + chalk.yellow('<url>') + ' value'
            },
            {
                type: 'list',
                name: 'formatSelector',
                option: { name: 'format-selector', config: { alias: 'f', desc: 'Format selection technique: any, argument or extension', type: String } },
                choices: FORMAT_SELECTORS,
                message: 'How will the ' + chalk.yellow('<format>') + ' be specified?'
            },
            {
                type: 'list',
                name: 'formatDefault',
                option: { name: 'format-default', config: { alias: 'F', desc: 'Default format to use if no selection is made', type: String } },
                choices: readonlyProps => {
                    return (readonlyProps.templateFormats || this.answerOverrides.templateFormats);
                },
                message: 'Which <format ' + chalk.yellow('@default') + '> should we use?'
            },
            {
                type: 'list',
                name: 'authentication',
                option: { name: 'authentication', config: { alias: 'a', desc: 'Type of authentication required: none, guest, user or admin', type: String } },
                choices: AUTHENTICATIONS,
                message: 'What level of ' + chalk.yellow('<authentication>') + ' is required to run the webscript?'
            },
            {
                type: 'input',
                name: 'authenticationRunas',
                option: { name: 'authentication-runas', config: { alias: 'r', desc: 'User webscript should run as', type: String } },
                message: 'Which user should the webscript <authentication ' + chalk.yellow('@runas') + '>? (leave empty for the calling user)'
            }

        ]).then((answers) => {
            answers.methods.forEach(method => {
                const descName = answers.id + '.' + method + '.desc.xml';
                this.fs.copyTpl(this.templatePath('desc.xml'), this.destinationPath(descName), answers);

                answers.templateFormats.forEach(format => {
                    const fmtPath = this.templatePath(format + '.ftl');
                    const tplName = answers.id + '.' + method + '.' + format + '.ftl';
                    this.fs.copyTpl(fmtPath, tplName, answers);
                });

                ['en', 'ar', 'fr'].forEach(locale => {
                    const propPath = this.templatePath(locale + '.properties');
                    const localeName = answers.id + '.' + method + (locale === 'en' ? '' : '_' + locale) + '.properties';
                    this.fs.copyTpl(propPath, localeName, answers);
                });
                const javaSrcPath = this.templatePath('DeclarativeWebScript.java');
                const jsSrcPath = this.templatePath('controller.js');
                const wsSrcPath = this.templatePath('webscript-context.xml');
                if (answers.language !== 'Java') {
                    const jsControllerName = answers.id + '.' + method + '.js';
                    this.fs.copyTpl(jsSrcPath, jsControllerName, answers);
                }

                if (answers.language !== 'JavaScript') {
                    answers.className = _.upperFirst(_.camelCase(answers.id)) + _.upperFirst(method);
                    answers.qualifiedClassName = answers.classPackage + '.' + answers.className;
                    answers.beanId = 'webscript.packageName' + answers.id + '.' + method;
                    const javaControllerName = answers.className + '.java';
                    this.log('Generating ' + javaControllerName);
                    this.fs.copyTpl(javaSrcPath, javaControllerName, answers);

                    const contextName = 'webscript-' + answers.id + '-' + method + '-context.xml';
                    this.log('Generating ' + contextName);
                    this.fs.copyTpl(wsSrcPath, contextName, answers);
                }
            });
        });
    }



};

