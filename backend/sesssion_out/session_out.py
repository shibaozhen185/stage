from connection import (with_session,
                        )
import sys

@with_session(sys.argv[1])
def session_out(name,
                with_session):
    index = -1
    ip_address_cmd = ["/ip/address/print"]
    ip_address = with_session.excute_cli(ip_address_cmd)
    for ip_address_  in ip_address:
        index = index + 1
        if ip_address_.get("interface") == str("<pptp-"+name+">") or \
            ip_address_.get("interface")  == str("<l2tp-" + name + ">"):
            ip_address_remove = ["/ip/address/remove",
                                 "=numbers="+str(index)]
            with_session.excute_cli(ip_address_remove)
            return "Forced {name} offline success".format(name=name)

if __name__ == "__main__":
    session_out(sys.argv[2])
    
