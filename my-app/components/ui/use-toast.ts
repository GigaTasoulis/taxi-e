const toastQueue: any[] = []

export const useToast = () => {
  return {
    toast: (props: any) => {
      // If we're in the browser, show the toast
      if (typeof window !== "undefined") {
        console.log("Toast:", props.title, props.description)

        // Add to queue for potential UI rendering
        toastQueue.push(props)

        // For destructive messages, show an alert as fallback
        if (props.variant === "destructive") {
          alert(`${props.title}: ${props.description}`)
        }
      }
    },
  }
}

