#include "mgos.h"
#include "mgos_i2c.h"
#include "mgos_si7021.h"

#include <ti/drivers/Power.h>
#include <ti/drivers/power/PowerCC32XX.h>

#include "CC3220SF_LAUNCHXL.h"

static struct mgos_si7021 *s_si7021;

bool tempInit() {
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

float tempGet() {
    return mgos_si7021_getTemperature(s_si7021);
}

float humGet() {
    return mgos_si7021_getHumidity(s_si7021);
}

void sleep() {
    Power_enablePolicy();
}
