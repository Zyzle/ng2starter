import {Component} from 'angular2/core';

@Component({
    selector: 'hello-app',
    templateUrl: 'app/hello.html'
})
export class HelloApp {
    name: string = 'World';
}
