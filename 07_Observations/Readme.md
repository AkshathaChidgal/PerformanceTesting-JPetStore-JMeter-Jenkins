## Workload Modeling & Capacity Findings

### Overview
The JPetStore performance tests were executed using Apache JMeter’s Ultimate Thread Group to simulate realistic user flows:
- Search
- View Product Details
- Add to Cart
- Checkout

### Initial Attempt
The first workload model used **25 concurrent users** distributed across the 4 scenarios.  
Test execution failed after approximately **1.5 minutes** due to server resource constraints on the local environment.

### Iterative Tuning
After adjusting thread distribution and timings, the test completed successfully with **16 concurrent users**. This configuration is considered the **baseline capacity** for the current environment.

### Final User Distribution
| Scenario       | Users | % of Traffic | Ramp-up Time | Hold Time | Ramp-down Time |
|----------------|-------|--------------|--------------|-----------|----------------|
| Search         | 6     | 38%          | 8 sec/user   | 120 sec   | 5 sec           |
| View Details   | 6     | 38%          | 8 sec/user   | 120 sec   | 5 sec           |
| Add to Cart    | 3     | 19%          | 8 sec/user   | 120 sec   | 5 sec           |
| Checkout       | 1     | 5%           | 8 sec/user   | 120 sec   | 5 sec           |

### Key Observation
> With the above configuration, the system handled all requests successfully, average response time remained within acceptable limits, and no errors were recorded.
