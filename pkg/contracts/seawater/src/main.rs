use libseawater::user_entrypoint as stylus_entrypoint;

pub extern "C" fn user_entrypoint(len: usize) -> usize {
    stylus_entrypoint(len)
}

// for whatever reason, even with `#[no_main]` or `#[cfg(test)] fn main(){}` this crate fails to
// build for tests without this
fn main() {}
