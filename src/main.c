#include "mgos.h"
#include "mgos_i2c.h"
#include "mgos_si7021.h"

#include <ti/drivers/Power.h>
#include <ti/drivers/power/PowerCC32XX.h>

#include "CC3220SF_LAUNCHXL.h"

static struct mgos_si7021 *s_si7021;

bool si7021_init() {
    LOG(LL_INFO, ("Intialising Si7021..."));

    struct mgos_i2c *i2c;

    i2c = mgos_i2c_get_global();
    if (!i2c) {
        LOG(LL_ERROR, ("I2C bus missing."));
        return false;
    } else {
        s_si7021 = mgos_si7021_create(i2c, 0x40); // Default I2C address
        if (s_si7021) {
            LOG(LL_INFO, ("Successfully initialised Si7021!"));
            return true;
        } else {
            LOG(LL_ERROR, ("Could not initialise sensor."));
            return false;
        }
    }
}

float si7021_temp_get() {
    return mgos_si7021_getTemperature(s_si7021);
}

float si7021_hum_get() {
    return mgos_si7021_getHumidity(s_si7021);
}

/**
 * Enables power policy.
 * Seems to kill RPC calls.
 */
void cc_power_enable() {
    LOG(LL_INFO, ("Enabling power policy..."));
    Power_enablePolicy();
}

/**
 * Puts device to sleep.
 * Seems to consume more power.
 */
void cc_power_sleep() {
    LOG(LL_INFO, ("Going to sleep..."));
    Power_sleep(PowerCC32XX_LPDS);
    LOG(LL_INFO, ("Awoken!"));
}

/**
 * Shuts device down for given number of seconds.
 */
void cc_power_shutdown(int seconds) {
    LOG(LL_INFO, ("Shutting down..."));
    Power_shutdown(PowerCC32XX_LPDS, seconds * 1000);
}
