import type { Plugin } from '@masknet/plugin-infra'
import { base } from '../base'
import { useMemo, Suspense } from 'react'
import { Skeleton } from '@mui/material'
import { makeStyles } from '@masknet/theme'
import MaskPluginWrapper from '../../MaskPluginWrapper'
import { extractTextFromTypedMessage } from '../../../protocols/typed-message'
import { parseURL } from '@masknet/shared'
import Profile from './Profile'

const useStyles = makeStyles()((theme) => {
    return {
        skeleton: {
            margin: theme.spacing(2),
            '&:first-child': {
                marginTop: theme.spacing(3),
            },
        },
    }
})

const isCyberConnectUrl = (x: string): boolean => x.includes('app.cyberconnect.me')

function Renderer({ url }: { url: string }) {
    const { classes } = useStyles()
    return (
        <MaskPluginWrapper pluginName="CyberConnect">
            <Suspense
                fallback={Array.from({ length: 2 })
                    .fill(0)
                    .map((_, i) => (
                        <Skeleton
                            key={i}
                            className={classes.skeleton}
                            animation="wave"
                            variant="rectangular"
                            width={i === 0 ? '80%' : '60%'}
                            height={15}
                        />
                    ))}>
                <Profile url={url} />
            </Suspense>
        </MaskPluginWrapper>
    )
}

const sns: Plugin.SNSAdaptor.Definition = {
    ...base,
    init(signal) {},
    DecryptedInspector: function Component(props): JSX.Element | null {
        const text = useMemo(() => extractTextFromTypedMessage(props.message), [props.message])
        const link = useMemo(() => parseURL(text.val || ''), [text.val]).find(isCyberConnectUrl)
        if (!text.ok) return null
        if (!link) return null
        return <Renderer url={link} />
    },
    // PostInspector: function Component(): JSX.Element | null {
    //     const links = usePostInfoDetails.postMetadataMentionedLinks().concat(usePostInfoDetails.postMentionedLinks())
    //     const link = links.find(isCyberConnectUrl)
    //     if (!link) return null
    //     return <Renderer url={link} />
    // },
}

export default sns
