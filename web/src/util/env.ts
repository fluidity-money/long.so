const mustEnv = (name: string) => {
  const v = process.env[name]
  if (!v)
    throw new Error(`Failed to fetch required env ${name}!`)
  return v
}

export {
  mustEnv,
}
