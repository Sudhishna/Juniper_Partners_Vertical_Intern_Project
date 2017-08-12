# IP CIDR Widget


## Introduction
The IP CIDR widget is a reusable graphical user interface that allows users to get a set of IP address (version 4 or version 6), CIDR and subnet mask inputs. Each input is validated according to the expected value (IP, CIDR or Subnet) and also according to the combination of values of the fields.

## API
The IP CIDR widget follows the widget programming interface standards, therefore it exposes: a build and destroy methods and any data required by the widget is passed by its constructor.


###Configuration
The configuration object has two variables:

```
{
	container: <define the container where the widget will be rendered>,
	elements: <optional, define the set of key/value that should be used to overwrite the default IP CIDR values>
}
```

For example, an IP CIDR widget with default values should be instantiated with:

```
{
    var ipCidr = new IpCidrWidget({
                     "container": '#ipCidr'
                 });
}
```

The IP CIDR widget default values are:

```
    {
        "ip_label": "IP Address",
        "ip_id": "text_ip",
        "ip_name": "text_ip",
        "ip_placeholder": "IPv4 or IPv6 address",
        "ip_required": "true",
        "ip_tooltip": "IPv6 example: 2001:db8:85a3:0:0:8aa2e:370:7334",
        "ip_error": "Invalid IP address format",
        "cidr_label": "/",
        "cidr_id": "text_cidr",
        "cidr_name": "text_cidr",
        "cidr_placeholder": "CIDR",
        "cidr_error": "Invalid CIDR",
        "subnet_label": "Subnet mask",
        "subnet_id": "text_subnet",
        "subnet_name": "text_subnet",
        "subnet_placeholder": "",
        "subnet_error": "Please enter a valid subnet mask"
    },
```

An IP CIDR widget with user defined values should be instantiated with:

```
    var ipCidr = new IpCidrWidget({
                     "container": '#ipCidr',
                     "elements": userValues
                 })
```

where the "elements" should be defined in a set of key/value pairs. For example:

```
    var userValues = {
                        "ip_label": "IP Address",
                        "ip_id": "text_ip",
                        "ip_name": "text_ip",
                        "ip_placeholder": "IP v4 or v6",
                        "ip_required": "true",
                        "ip_tooltip": "IP v6 example",
                        "ip_error": "Invalid IP address",
                        "cidr_label": "/",
                        "cidr_id": "text_cidr",
                        "cidr_name": "text_cidr",
                        "cidr_placeholder": "CIDR",
                        "cidr_error": "Invalid CIDR",
                        "subnet_label": "Subnet",
                        "subnet_id": "text_subnet",
                        "subnet_name": "text_subnet",
                        "subnet_placeholder": "Subnet placeholder",
                        "subnet_error": "Please enter a valid subnet mask"
                      }
```

###Build
Adds the dom elements and events of the IP CIDR widget in the specified container. For example:

```
{
    ipCidr.build();
}
```

###Destroy
Clean up the specified container from the resources created by the IP CIDR widget.

```
{
    ipCidr.destroy();
}
```

## Usage

### Programmatic Form (Form Widget)
The IP CIDR widget is integrated to the form widget. To include it, the configuration object of the Form Widget (elements parameter) should include an element_ipCidrWidget parameter like the following:

```
    {
        "element_ipCidrWidget": true
    },
```

When the form widget is build, it will include the IP CIDR widget with its default values. To overwrite default values from the Form Widget configuration object, include the following parameters:

```
    {
        "element_ipCidrWidget": true,
        "id": "text_ipCidrWidget1",
        "label": "IP/CIDR Widget",
        "ip_id": "text_ip1",
        "ip_name": "text_ip1",
        "ip_placeholder": "IP v4 or v6",
        "ip_required": "true",
        "ip_tooltip": "IP v6 example",
        "ip_error": "Invalid IP address",
        "cidr_id": "text_cidr",
        "cidr_name": "text_cidr",
        "cidr_placeholder": "CIDR",
        "cidr_error": "Invalid CIDR",
        "subnet_id": "text_subnet",
        "subnet_name": "text_subnet",
        "subnet_placeholder": "Subnet placeholder",
        "subnet_error": "Please enter a valid subnet mask"
    },
```

If custom validation is required, then a "customValidationCallback" configuration should be included. The callback has eleIp, eleCidr, eleSubnet and showErrorMessage parameters. eleIp is the DOM element of IP input. eleCidr is the DOM element of CIDR input. eleSubnet is the DOM element of Subnet input. showErrorMessage is a callback that should be invoked with one parameter: error. The parameter is optional. If it's given, the given message will be shown, if not, the default error message will be shown. For example, the customValidationCallback could be defined as:

```
    {
        "element_ipCidrWidget": true,
        "label": "For custom validation",
        "customValidationCallback": function(eleIp, eleCidr, eleSubnet, showErrorMessage) {
            var result = true,
                cidrVal = eleCidr.value,
                isIpv4 = validator.isValidValue('ipv4', eleIp);
            if(isIpv4 && parseInt(cidrVal) > 5){
                result = false;
            }else if(!isIpv4 && parseInt(cidrVal) > 10){
                result = false;
            }
            if(! result){
                showErrorMessage("Ipv4's cidr cannot exceed 5, Ipv6's cidr cannot exceed 10");
            }
        }
    }
```

Additionally, "ip_version" parameter can be set to specify the valid IP address version(version 4 or 6). "4" for version 4 and "6" for version 6.

```
    {
        "element_ipCidrWidget": true,
        "label": "IPv4 Only",
        "ip_version": "4"
    }
```

### Declarative Form
To add an IP CIDR widget in a container, follow these steps:
1. Instantiate the IP CIDR widget and provide a configuration object with the list of elements to overwrite the widget default values (optional) and the container where the IP CIDR widget will be rendered
2. Call the build method of the IP CIDR widget

```
     var ipCidr = new IpCidrWidget({
         "container": '#ipCidr',
         "elements": userValues
     });
    ipCidr.build();
```

Optionally, the destroy method can be called to clean up resources created by the list builder widget.

## Utility methods
The IP CIDR widget exposes additional methods intended to help user to get the values assigned to its inputs. These methods are: getValues, getIpCidrValue and setValues.

#### getValues
It provides the values assigned to the IP, CIDR and Subnet inputs. It's presented in an object key/value set for each input, where key is the id of the input and value is the value of the input.

#### getIpCidrValue
It provides the values assigned to the IP and CIDR inputs. It's presented in a string composed by the value of the IP input plus the "/" symbol plus the CIDR value.

#### setValues
Set the value of the IP CIDR widget.
**ip**: The given IP address.
**cidr**: The given IP CIDR.
**subnet**: The given subnet.

For example:
```
    widgetInstance = this.form.getInstantiatedWidgets()[widgetIdentifier].instance;
    widgetInstance.setValues('2.3.4.5','5');
```
