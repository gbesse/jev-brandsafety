// Purpose: Compile-time public API exercise.
import{classify,FakeJev,extractHtml}from'../src/index.mjs';extractHtml('<p>x</p>');void classify({text:'x',maxChars:100},{provider:new FakeJev()});
