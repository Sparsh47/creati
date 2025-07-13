import * as FaIcons from 'react-icons/fa'
import * as MdIcons from 'react-icons/md'
import * as AiIcons from 'react-icons/ai'
import { IconType } from 'react-icons'
import React from "react";

const ALL_ICONS: Record<string, IconType> = {
    ...FaIcons,
    ...MdIcons,
    ...AiIcons,
}

export interface DynamicIconProps {
    iconName: string
    size?: number
    color?: string
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
                                                            iconName,
                                                            size = 40,
                                                            color,
                                                            ...rest
                                                        }) => {
    const IconComp = ALL_ICONS[iconName]
    if (!IconComp) return null
    return <IconComp size={size} color={color} {...rest} />
}
