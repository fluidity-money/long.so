use libseawater::user_entrypoint as stylus_entrypoint;

pub extern "C" fn user_entrypoint(len: usize) -> usize {
    stylus_entrypoint(len)
}

fn main() {}
