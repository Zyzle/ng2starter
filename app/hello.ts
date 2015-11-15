import {Component} from 'angular2/angular2';

@Component({
    selector: 'hello-app',
    templateUrl: 'app/hello.html'
})
export class HelloApp {
    name: string = 'World';
}
