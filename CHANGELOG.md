## [5.2.4](https://github.com/CassandraSpruit/Vivi/compare/v5.2.3...v5.2.4) (2020-02-04)


### Bug Fixes

* v-each doesn't blow up if array is undefined ([15ebbac](https://github.com/CassandraSpruit/Vivi/commit/15ebbac0d42a7bf00d7879aabd16cf04c57e9413))
* v-each doesn't blow up if array is undefined ([40f6cc5](https://github.com/CassandraSpruit/Vivi/commit/40f6cc5c1f0ad4f543263d7954d384fedd5f4633))

## [5.2.3](https://github.com/CassandraSpruit/Vivi/compare/v5.2.2...v5.2.3) (2020-01-29)

## [5.2.2](https://github.com/CassandraSpruit/Vivi/compare/v5.2.1...v5.2.2) (2020-01-14)


### Bug Fixes

* **module:** fixed overrides using the wrong names ([ebc055b](https://github.com/CassandraSpruit/Vivi/commit/ebc055bc95a5ffd19248c79a338ff3e1b247da3e))
* **module:** fixed overrides using the wrong names ([1811ac5](https://github.com/CassandraSpruit/Vivi/commit/1811ac564ccbadf0ec2765cf7931c92620f96a13)), closes [#16](https://github.com/CassandraSpruit/Vivi/issues/16)

## [5.2.1](https://github.com/CassandraSpruit/Vivi/compare/v5.2.0...v5.2.1) (2020-01-13)


### Bug Fixes

* **component:** child elements throw error when loaded in load fn ([80004bb](https://github.com/CassandraSpruit/Vivi/commit/80004bb77dd90f0730dc0928a5adfb2f0abbb7f1))

# [5.2.0](https://github.com/CassandraSpruit/Vivi/compare/v5.1.0...v5.2.0) (2020-01-12)


### Features

* **component:** added bind ([db5c020](https://github.com/CassandraSpruit/Vivi/commit/db5c02048df854ce55cd7c0f16a7140a46c45a1d))

# [5.1.0](https://github.com/CassandraSpruit/Vivi/compare/v5.0.4...v5.1.0) (2020-01-12)


### Features

* **services:** services are injectable ([4fd8583](https://github.com/CassandraSpruit/Vivi/commit/4fd8583edcfca8bd264e35d2a90e46ed99f36043)), closes [#10](https://github.com/CassandraSpruit/Vivi/issues/10)

## [5.0.4](https://github.com/CassandraSpruit/Vivi/compare/v5.0.3...v5.0.4) (2020-01-12)


### Bug Fixes

* **service:** dropped "service" from baked-in services ([69141a4](https://github.com/CassandraSpruit/Vivi/commit/69141a491606cce997138cacc0a3e52ce3920839)), closes [#9](https://github.com/CassandraSpruit/Vivi/issues/9)

## [5.0.3](https://github.com/CassandraSpruit/Vivi/compare/v5.0.2...v5.0.3) (2020-01-12)


### Bug Fixes

* **greenkeeper:** enabled Greenkeeper ([69009eb](https://github.com/CassandraSpruit/Vivi/commit/69009ebbc8ff8da2e5edd952b3c7b43b0bdee59e))

## [5.0.2](https://github.com/CassandraSpruit/Vivi/compare/v5.0.1...v5.0.2) (2020-01-12)


### Bug Fixes

* **pkg:** manually updating pkg ([3019925](https://github.com/CassandraSpruit/Vivi/commit/3019925ca07d9bba75ff93c76115bc212f6cd6b4))

## [1.0.1](https://github.com/CassandraSpruit/Vivi/compare/v1.0.0...v1.0.1) (2020-01-12)


### Bug Fixes

* **pkg:** Manually updating package number ([7fcfdff](https://github.com/CassandraSpruit/Vivi/commit/7fcfdfff05f8af8eb9babd7cc4bebfa277d96a7c))

# 1.0.0 (2020-01-12)


### Bug Fixes

* **build:** removed last decorator reference ([3fdd89d](https://github.com/CassandraSpruit/Vivi/commit/3fdd89d5ce60de361450183752f1f72461e5eae0))
* **comp:** querySelector needs # for id ([85a484a](https://github.com/CassandraSpruit/Vivi/commit/85a484adf016c933e86dabb35d4762f47a984e4d))
* **compFact:** create root and create  split ([346efa2](https://github.com/CassandraSpruit/Vivi/commit/346efa2e009d9b3ad995c0103b7d31ddfb5c3f03))
* **component:** nodeTreeService added to Component class ([#88](https://github.com/CassandraSpruit/Vivi/issues/88)) ([99772b0](https://github.com/CassandraSpruit/Vivi/commit/99772b0b6b1f6a3236fc17b7b658ca9eeb142000)), closes [#85](https://github.com/CassandraSpruit/Vivi/issues/85)
* **event:** events moved to external pkg, rxjs dropped ([e7b71ac](https://github.com/CassandraSpruit/Vivi/commit/e7b71acd71f0fec29eb31382a521e4d9c4284021))
* **factory:** prereqs removed ([aed60d7](https://github.com/CassandraSpruit/Vivi/commit/aed60d7f986aa0a063309a255da6d718c4c67ba4))
* **factory:** window.vivi removed ([9e068aa](https://github.com/CassandraSpruit/Vivi/commit/9e068aaf582c15d7b4af3c9ca8be15e2f84f62ab))
* **js:** fixed imports ([1491bc6](https://github.com/CassandraSpruit/Vivi/commit/1491bc64879bb4fa13a43862fa23cdd7d73b2949))
* **lint:** automatic lint fixes ([dfe39ae](https://github.com/CassandraSpruit/Vivi/commit/dfe39aee849b49ccdebe5464f4d7f233c1500be4))
* **lint:** fix non-automatic lint issues ([0b673d7](https://github.com/CassandraSpruit/Vivi/commit/0b673d7c77c6ba7760d16cbe71271c68b01af9d6))
* **module:** get component registry should return keys ([5989fad](https://github.com/CassandraSpruit/Vivi/commit/5989fadd2867f11f9e0559558fdd236851aa0d6f))
* **module:** get throws console error + trace, not error message on error ([#91](https://github.com/CassandraSpruit/Vivi/issues/91)) ([d869fc2](https://github.com/CassandraSpruit/Vivi/commit/d869fc23abef229bd060e46192b2a442e2fc4d94)), closes [#90](https://github.com/CassandraSpruit/Vivi/issues/90)
* **module:** Removed factoryService ([731f8f8](https://github.com/CassandraSpruit/Vivi/commit/731f8f8c8ddce846369672e480e7e6891b75ba46))
* **module:** rootComponent module param is now required to avoid bugs ([ee550ba](https://github.com/CassandraSpruit/Vivi/commit/ee550ba92024e5306beb281c10df42ffb3325ec5))
* **node-tree:** component append behavior better reflects node-tree ([#81](https://github.com/CassandraSpruit/Vivi/issues/81)) ([9b52647](https://github.com/CassandraSpruit/Vivi/commit/9b526470a3c2e9c0a1e8c539a7f14e3ad1a96505)), closes [#79](https://github.com/CassandraSpruit/Vivi/issues/79) [#78](https://github.com/CassandraSpruit/Vivi/issues/78) [#71](https://github.com/CassandraSpruit/Vivi/issues/71) [#64](https://github.com/CassandraSpruit/Vivi/issues/64)
* **npm:** installed missing release plugins ([4a046eb](https://github.com/CassandraSpruit/Vivi/commit/4a046eb087850d1f333acd51d872767de79b6563))
* **npm:** publish cmds were conflicting with other publishes ([7621489](https://github.com/CassandraSpruit/Vivi/commit/76214890725e88740e86480e4c5a24d9599cfa9d))
* **pkg:** moved array-like-map to its own pkg ([0459a2f](https://github.com/CassandraSpruit/Vivi/commit/0459a2f0c86a8eb93198fd3c1fd10ba4d2bfc7ea))
* **test:** fixed test to pass ([e02bed8](https://github.com/CassandraSpruit/Vivi/commit/e02bed8d16b7608656f316d21133384f8f8852e1))
* **travis:** release should run dist not build ([fb30d50](https://github.com/CassandraSpruit/Vivi/commit/fb30d50511a876306c38819f3c078d526cea9cfb))
* **travis:** release was missing plugins ([8481392](https://github.com/CassandraSpruit/Vivi/commit/8481392fad51574bb67a1e66a638142044ca2f81))
* **webpack:** added source map back in ([963acd1](https://github.com/CassandraSpruit/Vivi/commit/963acd10068635c78080e207f1ad678724d33cd5))
* **webpack:** changing webpack config to better handle library ([4ed9761](https://github.com/CassandraSpruit/Vivi/commit/4ed976138251920adfcd5893a2293e7c255c90af))


### Features

* **component:** added foreach in templates, nodeTree ([61f98fc](https://github.com/CassandraSpruit/Vivi/commit/61f98fc4a7fd364f956cbf3c66cf2e37a81e17b8))
* **component:** added foreach in templates, nodeTree ([1b66848](https://github.com/CassandraSpruit/Vivi/commit/1b66848437d100b6a08f60a29bb68fee536d59c8)), closes [#35](https://github.com/CassandraSpruit/Vivi/issues/35)
* **error:** added logger service ([ab29528](https://github.com/CassandraSpruit/Vivi/commit/ab2952874bc2a85aa3fb404f70816c45c5d87bbf))
* **factory:** added generics to get and getFactory ([#84](https://github.com/CassandraSpruit/Vivi/issues/84)) ([9ecf321](https://github.com/CassandraSpruit/Vivi/commit/9ecf3219fe3e31800eda5d8dd700791f0dc31de4)), closes [#77](https://github.com/CassandraSpruit/Vivi/issues/77)
* **factory:** allow for factories to be created outside of init ([bb7b9a8](https://github.com/CassandraSpruit/Vivi/commit/bb7b9a8e859a2fdca0e1cf53391dc645498d8220))
* **factory:** components, service, component constructors, service constructors all take generics ([53e860f](https://github.com/CassandraSpruit/Vivi/commit/53e860f17dbedaff69846567fab0f2a32313e77e))
* **logger:** Added options - log to module ([f53494e](https://github.com/CassandraSpruit/Vivi/commit/f53494e20a0816a1f18114e4a780c60837dad9f5))
* **module:** Module factory init optional ([de42722](https://github.com/CassandraSpruit/Vivi/commit/de4272232978a1b5f6c0090fa12406fdf7351835))


### BREAKING CHANGES

* **node-tree:** CompFactory create and component append are combined. Load logic moved to node
tree. Detach logic moved to node tree. Factory.get() returns the last created, not first.
* **factory:** "Vivi" in factories and their constructor class names have been ommited and
renamed. Ex: ViviComponentFactory -> ComponentFactory
* **module:** RootComponent and ComponentConstructors are now required in the ModuleFactory
instead of being optional.
* **component:** ComponentFactory.create() requires a parent component.

## [4.1.9](https://github.com/CassandraSpruit/Vivi/compare/v4.1.8...v4.1.9) (2019-12-12)

## [4.1.8](https://github.com/CassandraSpruit/Vivi/compare/v4.1.7...v4.1.8) (2019-11-28)

## [4.1.7](https://github.com/CassandraSpruit/Vivi/compare/v4.1.6...v4.1.7) (2019-11-20)


### Bug Fixes

* **module:** get throws console error + trace, not error message on error ([#91](https://github.com/CassandraSpruit/Vivi/issues/91)) ([d869fc2](https://github.com/CassandraSpruit/Vivi/commit/d869fc23abef229bd060e46192b2a442e2fc4d94)), closes [#90](https://github.com/CassandraSpruit/Vivi/issues/90)

## [4.1.6](https://github.com/CassandraSpruit/Vivi/compare/v4.1.5...v4.1.6) (2019-11-20)

## [4.1.5](https://github.com/CassandraSpruit/Vivi/compare/v4.1.4...v4.1.5) (2019-11-20)


### Bug Fixes

* **component:** nodeTreeService added to Component class ([#88](https://github.com/CassandraSpruit/Vivi/issues/88)) ([99772b0](https://github.com/CassandraSpruit/Vivi/commit/99772b0b6b1f6a3236fc17b7b658ca9eeb142000)), closes [#85](https://github.com/CassandraSpruit/Vivi/issues/85)

## [4.1.4](https://github.com/CassandraSpruit/Vivi/compare/v4.1.3...v4.1.4) (2019-11-20)


### Bug Fixes

* **webpack:** added source map back in ([963acd1](https://github.com/CassandraSpruit/Vivi/commit/963acd10068635c78080e207f1ad678724d33cd5))

## [4.1.3](https://github.com/CassandraSpruit/Vivi/compare/v4.1.2...v4.1.3) (2019-11-20)


### Bug Fixes

* **webpack:** changing webpack config to better handle library ([4ed9761](https://github.com/CassandraSpruit/Vivi/commit/4ed976138251920adfcd5893a2293e7c255c90af))

## [4.1.2](https://github.com/CassandraSpruit/Vivi/compare/v4.1.1...v4.1.2) (2019-11-20)


### Bug Fixes

* **travis:** release should run dist not build ([fb30d50](https://github.com/CassandraSpruit/Vivi/commit/fb30d50511a876306c38819f3c078d526cea9cfb))

## [4.1.1](https://github.com/CassandraSpruit/Vivi/compare/v4.1.0...v4.1.1) (2019-11-20)


### Bug Fixes

* **npm:** installed missing release plugins ([4a046eb](https://github.com/CassandraSpruit/Vivi/commit/4a046eb087850d1f333acd51d872767de79b6563))
* **npm:** publish cmds were conflicting with other publishes ([7621489](https://github.com/CassandraSpruit/Vivi/commit/76214890725e88740e86480e4c5a24d9599cfa9d))
* **travis:** release was missing plugins ([8481392](https://github.com/CassandraSpruit/Vivi/commit/8481392fad51574bb67a1e66a638142044ca2f81))
