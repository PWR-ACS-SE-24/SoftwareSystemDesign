---
scope: Jobberknoll
date: 2025-01-14
deciders: "@tchojnacki"
informed: "@mlodybercik, @jakubzehner, @piterek130"
---

# Password hashing and storage requirements for Jobberknoll

## Context and Problem Statement

Passwords need to be securely stored in Jobberknoll's database. To achieve this, we need to define password hashing and storage requirements. According to [OWASP recommendations](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), passwords should be stored after hashing with **Argon2id** (with other alternatives provided). The stored data should include the salt and information about the hashing algorithm used. Unfortunately, due to Argon2id's computational load, it has no supported implementations in JavaScript or TypeScript. This means, that we have to use FFI to call native libraries or use a less secure alternative.

## Considered Options

- Using Argon2id with FFI
- Using a less secure key derivation function (e.g. bcrypt)

## Decision Outcome

Chosen option: **Using Argon2id with FFI**, because it heavily simplifies the service implementation while retaining almost indistinguishable functionality for the consumers.

The backend must use Argon2id implemented in a native language (e.g. Rust, C, C++) and accessed via FFI. After auditing circa 10 libraries, it was decided to use [@node-rs/argon2](https://www.npmjs.com/package/@node-rs/argon2), which provides bindings for RustCrypto. It is the most popular library for Argon2id in the Node.js package registry. It is well supported in the Deno runtime and provides the `verify` function, which offloads the password verification from our service (and the process is not trivial, since it requires a constant-time comparison). The OWASP recommendations for algorithm parameters should be followed.

The password must be stored using the [modular PHC string format](https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md), to retain the ability to change the hashing algorithm in the future. Passwords should be rehashed on first login after the change of the hashing algorithm.

## Consequences

- Good, because we use the algorithm recommended by OWASP.
- Good, because the hashing and validation of passwords can be offloaded to an external library.
- Good, because the modular PHC string format allows smooth algorithm changes in the future.
- Bad, because the usage of FFI blocks us from using `deno compile` to produce standalone executables.
- Bad, because despite being the most popular and most supported library, it was not externally audited.
