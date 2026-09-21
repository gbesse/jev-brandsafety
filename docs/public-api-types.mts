// Purpose: Compile-time public API exercise.
import{classify,FakeJev,extractHtml}from'../src/index.mjs';extractHtml('<p>x</p>');void classify({text:'x'},{provider:new FakeJev()});
