# Thinking About Testing

Thinking about testing, specifically automated testing of software, is about how to
effectively use automated tests to ensure software quality. [ISO 25010] provides a
comprehensive view of software quality. Automated tests are the primary tool used to
ensure functional correctness and completeness, compatibility, and maintainability.
They are also an excellent tool for preventing regressions in usability, security,
and reliability.

[ISO 25010]: https://iso25000.com/index.php/en/iso-25000-standards/iso-25010

## Testing in layers

An effectively strategy includes tests at many layers.


### Layer 1 - Fast in-process tests

Most tests should be fast in-process tests.

* fast is arbitrary, but generally a 100ms threshold is a reasonable limit on the run time
* in-process means that the function being tested, and the test code are in the same
  process. These tests may start additional processes as test fixtures as long as the run
  time of the test remains less than the threshold.
* tests are written in the same package as the function being tested
* tests are run using `go test -short ./...`

### Layer 2 - Slower in-process tests

Layer 2 tests are almost identical to layer 1. The tests are written in the same place,
and have the same relationship between unit-under-test and test case (same process). The
only difference is that tests at this layer may run longer than the threshold. There is no
upper limit, but generally they should run in a few seconds.

* tests are run using `go test ./...` (no `-short` flag)

### Layer 3 - Out-of-process tests

Layer 3 tests are no longer concerned with testing a specific function. Instead they test
a binary or container image. Layer 3 tests are generally tests of user facing functionality and
flows, not implementation details or error cases. Tests are written in some other package
(ex: `./tests`).

Tests at this layer act as a safety net. They should that a user is able to get the value
they expect out of the product. Any fix for a test failure at this level should
include a new test at layer 1 or 2 so that the behaviour is tested in one of the earlier
layers.


## Testing styles

There are many different styles of tests. Example tests are by far the most common, but
other styles can be useful in specific scenarios.

### Example based tests

Example based tests are the common style of testing that almost everyone is familiar with.
Example tests assert that some operation produces some expected result. They generally:

1. Setup any dependencies and state
2. Call the function-under-test
3. Assert that the returned values match the expected values, and that state was modified
   as expected.

Behavior Driven Development (BDD) tests are another example of example tests.

### Property testing

[Property testing] is much less common, but can be extremely useful for preventing
regression. A property test asserts that given some random inputs, a function always
produces a result that has a specific property.

For example, a function that formats input may always produce a string that is less than
10 characters. The property is "the result always has less than 10 characters". 

[Property testing]: https://en.wikipedia.org/wiki/Software_testing#Property_testing

Some common property tests include:

* `Equal` - any struct with an equal or comparison method should have a property test that
  shows that all fields are considered by the comparison. Adding a field without changing
  the `Equal` method would cause the test to fail.
* `Empty` or `IsZero` - similar to `Equal` a property test for a function like this would
  check that populating any single field would return false.
* Round-trip - any function that converts from one format into another can be tested to
  show that the original value is equal after passing through the convert functions.
  Similar to the cases above, this test would catch regressions where new fields are added
  without adding them to the convert function.


### Fuzz tests

[Fuzz testing], or fuzzing, is similar to property testing but is only concerned about one
property, that the function does not crash (does not panic). Most code does not benefit
from fuzz testing because the Go type system, along with good development practices of
avoiding the use of `nil`, and some example based tests, do a reasonable job of
preventing panics.

[Fuzz testing]: https://en.wikipedia.org/wiki/Fuzzing

Fuzz testing is critical for any function that receives input from a user as a `[]byte`
and processes it. Any network server (`net/http.Server`) or encoding/decoding library
(`encoding/json` or `go-yaml`) should have fuzz tests.

Most of the type we won't be writing our own decoding logic, but if we customize JSON
decoding or handle any raw input from users, we should add fuzz testing for those
functions.

Go recently [added support for fuzzing] to the standard library.

[added support for fuzzing]: https://go.dev/doc/fuzz/

### Benchmarks

A [benchmark] is a way of comparing the performance of different implementations using a
predefined scenario. Benchmarks are used to evaluate the efficiency of a function.
Benchmarks are important when code is being changed to optimize performance. They allow future
contributors to make changes to the code by giving them a way to evaluate the performance
of those changes.

[benchmark]: https://en.wikipedia.org/wiki/Benchmark_(computing)


The go toolchain has support for running and comparing benchmarks. See
[testing.Benchmarks].

[testing.Benchmarks]: https://pkg.go.dev/testing#hdr-Benchmarks


## Writing effective tests

1. Start by writing tests at the lowest possible layer. Write additional tests at higher
   layers for the most critical functionality.
2. Test an interface that users depend on.
   1. These interfaces will change left often, so the tests should require less
      maintenance.
   2. The tests will be closer to the experience of a user in production. 
3. Always "test the test" by watching the test fail. If the test doesn't fail as expected
   it is probably not testing as expected.
4. Include data that you do not expect to be modified as part of the test setup. Tests that
   only use data that is expected to change may miss cases where the operation is applying
   too broadly.
5. Always test the "happy path", and find a few important error or edge cases to test as well.
6. Capture all expected behaviour in assertions, and make the assertions as strict as
   possible.

### Conventions

Name the test after the function being tested, using the format:

```
Test[StructName_]FunctionName[_DescriptionOfTestCase]
```

Using a consistent format for test names helps make it easier to find the existing test
coverage of a particular function.

## Infra testing strategy

## Phase 1

1. Each package should generally have tests for its exported functions
2. Each API endpoint should have test cases for different response codes
3. Each CLI command should have test cases for different inputs
4. Each database migrations should have a test showing the migration works as expected
   from a snapshot of data captured from the previous version.

## Phase 2

1. Tests for complete user flows
2. Tests integration of a connector and the server
