# Benchmarks
Benchmarks are done with sample data. I test large data and small data, with both events turned on and off. Run benchmarks now using `npm run benchmark`

##### Get / set a boolean

```
cache.set simple boolean x 49,588,343 ops/sec ±1.26% (83 runs sampled)

EVENTS: evCache.set simple boolean x 1,393,522 ops/sec ±1.35% (87 runs sampled)

cache.get simple boolean x 67,521,345 ops/sec ±1.05% (81 runs sampled)

EVENTS: evCache.get simple boolean x 1,448,198 ops/sec ±0.80% (83 runs sampled)
```

##### Get / set a simple object

```
cache.set simple object x 38,059,207 ops/sec ±1.07% (87 runs sampled)

EVENTS: evCache.set simple object x 1,415,428 ops/sec ±0.73% (90 runs sampled)

cache.get simple object x 56,377,201 ops/sec ±1.35% (91 runs sampled)

EVENTS: evCache.get simple object x 1,465,387 ops/sec ±0.62% (83 runs sampled)
```

##### Get / set a simple object

```
cache.set a moderate amount of data x 50,772,591 ops/sec ±0.84% (92 runs sampled)

EVENTS: evCache.set a moderate amount of data x 1,432,305 ops/sec ±0.78% (93 runs sampled)

cache.get a moderate amount of data x 68,544,609 ops/sec ±1.57% (85 runs sampled)

EVENTS: evCache.get a moderate amount of data x 1,467,643 ops/sec ±0.78% (85 runs sampled)
```


##### Get / set a simple object

```
cache.set a large amount of data  x 151,234,934 ops/sec ±4.60% (76 runs sampled)

EVENTS: evCache.set a large amount of data  x 158,138,075 ops/sec ±4.49% (77 runs sampled)

cache.get a large amount of data x 181,930,657 ops/sec ±0.69% (90 runs sampled)

EVENTS: evCache.get a large amount of data x 181,643,371 ops/sec ±0.79% (84 runs sampled)
```
