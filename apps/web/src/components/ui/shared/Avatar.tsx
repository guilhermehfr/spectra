import Image from 'next/image'

interface AvatarWithImage {
  src: string
  alt: string
  text?: never
}

interface AvatarWithoutImage {
  text: string
  src?: never
  alt?: never
}

type AvatarProps = AvatarWithImage | AvatarWithoutImage

export function Avatar(props: AvatarProps) {
  if (props.src) {
    return <Image src={props.src} alt={props.alt} width={40} height={40} />
  }

  return (
    <div>
      <span>{props.text}</span>
    </div>
  )
}
