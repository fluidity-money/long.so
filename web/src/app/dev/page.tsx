'use client'

import styles from './page.module.scss'
import { Box, Button, Chip, Text } from "@/components"

const Dev = () => {
  return <div className={styles.dev}>Components
    <Box>This is a box</Box>
    <Button>This is a button</Button>
    <Chip>This is a chip</Chip>
    <Chip><Text weight="semibold">This is a chip</Text><Text weight="semibold">with multiple children</Text></Chip>
    <div><Text>This is some </Text><Text weight="semibold">variable weight text.</Text></div>
  </div>
}

export default Dev
