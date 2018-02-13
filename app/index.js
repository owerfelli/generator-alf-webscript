'use strict';

const chalk = require('chalk');
const filters = require('generator-alfresco-common').prompt_filters;

const LANGUAGES = ['Java', 'JavaScript', 'Both Java & JavaScript'];
const METHODS = ['get', 'post', 'put', 'delete'];
const TEMPLATE_FORMATS = ['html', 'json', 'xml', 'csv', 'atom', 'rss'];

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
                message: 'What ' + chalk.yellow('webscript id') + ' should we use?',
                invalidMessage: 'The ' + chalk.yellow('webscript id') + ' value is required',
                commonFilter: idFilter,
                valueRequired: true,
            },
            {
                type: 'input',
                name: 'shortname',
                option: { name: 'shortname', config: { alias: 's', desc: 'Shortname for webscript', type: String } },
                message: 'What ' + chalk.yellow('<shortname>') + ' should we use?',
                invalidMessage: 'The ' + chalk.yellow('shortname') + ' element is required',
                commonFilter: filters.requiredTextFilter,
                valueRequired: true,
            },
            {
                type: 'input',
                name: 'description',
                option: { name: 'description', config: { alias: 'd', desc: 'Description for webscript', type: String } },
                message: 'What ' + chalk.yellow('<description>') + ' should we use?',
                commonFilter: filters.optionalTextFilter,
                valueRequired: false,
            },
            {
                type: 'input',
                name: 'urlTemplates',
                option: { name: 'url-templates', config: { alias: 'u', desc: 'Vertical bar \'|\' separated list of url templates', type: String } },
                message: 'Provide a ' + chalk.green('|') + ' separated list of ' + chalk.yellow('<url>') + ' values',
                invalidMessage: 'At least one ' + chalk.yellow('url') + ' is required',
                commonFilter: urlTemplatesFilter,
                valueRequired: true,
            },
            {
                type: 'list',
                name: 'language',
                option: { name: 'language', config: { alias: 'l', desc: 'Language for webscript: java, javascript or both', type: String } },
                choices: LANGUAGES,
                message: 'Which language would you like to develop your script in?',
                commonFilter: filters.chooseOneMapStartsWithFilterFactory({ java: 'Java', javascript: 'JavaScript', both: 'Both Java & JavaScript' }),
                valueRequired: true,
            },
            {
                type: 'checkbox',
                name: 'methods',
                option: { name: 'methods', config: { alias: 'M', desc: 'A comma separated list of: get, put, post and/or delete', type: String } },
                choices: METHODS,
                default: ['get'],
                message: 'Which HTTP methods would you like to support?',
                invalidMessage: 'You must specify at least one method',
                commonFilter: filters.requiredTextListFilterFactory(',', METHODS),
                valueRequired: true,
            },
            {
                type: 'checkbox',
                name: 'templateFormats',
                option: { name: 'template-formats', config: { alias: 't', desc: 'A comma separated list of: html, json, xml, csv, atom and/or rss', type: String } },
                choices: TEMPLATE_FORMATS,
                default: ['html'],
                message: 'Which response formats would you like to support?',
                invalidMessage: 'You must specify at least one template format',
                commonFilter: filters.requiredTextListFilterFactory(',', TEMPLATE_FORMATS),
                valueRequired: false,
            }

        ]).then((answers) => {
            this.log(answers.id)
            this.log(answers.language)
            this.log(answers.methods)
            this.log(answers.templateFormats)
        });
    }



};

function idFilter(id) {
    if (!_.isString(id)) return undefined;
    const retv = _.kebabCase(id);
    // if after kebabbing our id we don't have anything left treat as undefined
    if (_.isEmpty(retv)) return undefined;
    return retv;
}

function urlTemplatesFilter (templates) {
    const urls = filters.requiredTextListFilter(templates, '|');
    if (urls) {
      return urls.map(url => {
        return (url.startsWith('/')
          ? url
          : '/' + url);
      });
    }
    return urls;
  }