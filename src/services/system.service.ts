import * as path from 'path';
import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';
import * as request from 'request';
import * as url from 'url';
import { Service } from '../models';

export class SystemService extends Service {
    path: typeof path;
    fs: typeof fs;
    https: typeof https;
    http: typeof http;
    request: typeof request;
    url: typeof url;

    constructor() {
        super();
        this.path = window.require('path');
        this.fs = window.require('fs');
        this.https = window.require('https');
        this.http = window.require('http');
        this.request = window.require('request');
        this.url = window.require('url');
    }
}