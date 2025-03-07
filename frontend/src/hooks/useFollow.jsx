import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const useFollow = () => {
    const queryClient = useQueryClient();

    const {mutate:follow, isPending} = useMutation({
        mutationFn: async (userId) => {
            try {
                const res = await fetch(`/api/users/follow/${userId}`, {
                    method: "POST",
                })
                const data = res.json();
    
                if(!res.ok){
                    throw new Error(data.error || "Something went wrong")
                }
                return data
            } catch (error) {
                throw new Error(error.message)
            }
        },
        onSuccess: () => {
            Promise.all([
                //refetch the suggested users
                queryClient.invalidateQueries({queryKey: ["suggestedUsers"]}),
                // refetch the authuser
                queryClient.invalidateQueries({queryKey: ["authUser"]})
            ])
            toast.success("Followed Successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return { follow, isPending }
}

export default useFollow