# Mapped Modules: Proof of Concept

This folder showcases ESM through modules as mapped names.

The **modukes.json** file exports names usable as ESM imports.
```js
{
  "module": "/js/hello-world.js"
}
```

As example, that `/js/hello-world.js` can be now imported via the following:
```js
import {esm} from '/:module';
esm();
```

regardless of where the import comes from.

### Caveats

  * the import must start with a `/` or ESM will throw
  * to explicitly opt in within the Service Worker modules resolver, you need to add a special, uncommon, module name prefix such `:` or `~` or `!` or even `@`, so that there is no ambiguity on what the SW should look for

The only script, at the end of the page, that is needed to run `/js/esm.js` as entry point and fallback to `/js/bundle.js` is the following one:

```js
(function (L, M, A, O) {
  if (A in M) M[A].register('sw.js')
    .then(function () {
      (M = L.createElement('script')).type = 'module';
      L.head.appendChild(M).src = 'js/esm.js';
    })
    .catch(O);
  else O();
}(
  document,
  navigator,
  'serviceWorker',
  function () {
    document.head.appendChild(
      document.createElement('script')
    ).src = 'js/bundle.js';
  }
));
```

You can test this PoC [directly here](https://webreflection.github.io/mapped-modules/).
