# Best Practices

This document will detail other changes that were made to this application
to help better conform to best practices, provide performance optimizations,
and other suggested improvements.

## Feature Modules

Feature modules are a way to organize code into groups by feature. This helps
to establish clear boundaries to keep features and functions separate from
other code.

Read more about [Feature Modules](https://angular.io/guide/styleguide#feature-modules)

#### Example

In this application, we moved the bus map and the side menu into its own bus-map
feature module. This way, all of the code around the bus-map feature is grouped
together.

## Rename Models

This application contains interface definition files that describe the shape
of the various objects used through the code. According to the Angular
style guide, files should have a suffix that describes the purpose of the file
when possible.

Read more about [Naming Conventions](https://angular.io/guide/styleguide#separate-file-names-with-dots-and-dashes)

#### Example

```
├── core
│ ├── models
│ │ ├── route.model.ts
```

## TrackBy

Trackby is a feature of the NgFor directive in Angular. Using it allows Angular
to be more efficient when rendering lists of items. By default, when a new list
is provided to the NgFor directive, Angular must recreate each of the nodes,
however the TrackBy function allows Angular to know if the objects are the same,
and if so, not rerender that node.

Read more about [TrackBy](https://angular.io/guide/template-syntax#ngfor-with-trackby)

#### Example

```html
<ul>
  <li *ngFor="let item of items; trackBy: trackByFn">{{ item.name }}</li>
</ul>
```

```typescript
interface ItemModel {
  id: number;
  name: string;
}

const items: ItemModel[] = [];

// TrackByFunction is a type supplied by Angular
const trackByFn: TrackByFunction = (item: ItemModel, index: number) => item.id;
```

## Tree-Shakable Providers

When providing services in Angular, we use the `@Injectable()` decorator and
list the service as a provider, typically in the root app module or core module
of an application (assuming we want a singleton for the application). To improve
tree-shaking during build time, and to simplify this process, Angular introduced
the `providedIn` property for the Injectable decorator. This lets you specify
`root` which automatically provides the service in the root injector of the
application. This also allows Angular to remove Services that are not actually
used in the application.

Read more about [Providing a Service](https://angular.io/guide/styleguide#providing-a-service)

#### Example

```typescript
@Injectable({
  providedIn: 'root'
})
export class MyService {}
```

# Other Suggestions

## Code Formatter

For general code mantainance, having a formatter in place is useful for keeping
the code styled the same. One of the most commonly used formatters is Prettier.
Prettier is highly opinionated on structure, but automatically handles correcting
the formatting of any code written in a project.

Read more about [Prettier](https://prettier.io/docs/en/why-prettier.html)

## Jest Testing Framework

Jest is a testing framework that describes itself as "[a delightful JavaScript
Testing Framework](https://jestjs.io)". The main benefits of using Jest over
Karma include the following:

- Significantly faster
- IDE integrations, see [vscode-jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)
- Only rerun tests that cover modified code
- Doesn't run in a browser (Great for CI/CD)

Read more about [Jest with Angular](https://www.xfive.co/blog/testing-angular-faster-jest/)

## Typescript Barrels

Barrel files are a way to re-export files through a single place where they
can then be easily imported from.

Read more about [Typescript Barrels](https://basarat.gitbooks.io/typescript/docs/tips/barrel.html)

> CAUTION! When using barrels, a file cannot import from a barrel that it
> gets re-exported through! Doing so will cause circular dependencies!
> (ie. SuperService (need another service) -> barrel (needs to read all the files
> in the barrel) -> SuperService)

## Typescript Path Mapping

Typescript path mapping allows you to create aliases to certain imports,
drastically helping avoid the perils of relative imports. Combining path mapping
together with barrels creates a wonderful developer experience in a code base.

Read more about [Typescript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)

#### Example

```typescript
// src/app/core/services/index.ts

export { MyService } from './my.service';
export { AnotherService } from './another.service';
export { SuperService } from './super.service';
```

```json
// tsconfig.json

{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@myapp/services": ["./app/core/services/index.ts"]
    }
  }
}
```

```typescript
// src/app/my-feature/pages/cool-page/cool-page.ts

// Don't use relative imports!
// import { MyService } from '../../../core/services/my.service';
// import { SuperService } from '../../../core/services/super.service';

// TS Path Mapping + Barrel = <3
import { MyService, SuperService } from '@myapp/services';
```
