#include "mgos.h"
#include "mgos_i2c.h"
#include "mgos_si7021.h"

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

void tempGet() {
    LOG(LL_INFO, ("tempGet"));
}
